from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Profile, ProfileMatchSuggestion
from .serializers import ProfileSerializer, ProfileCreateSerializer, ProfileMatchSuggestionSerializer
from notifications.utils import create_notification
from vector_search.gem_vectorDB import get_embedding, initialize_vector_db, CHROMA_COLLECTION_NAME, DETAIL_COLUMN_NAME

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'full_name', 'description']
    
    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update' or self.action == 'partial_update':
            return ProfileCreateSerializer
        return ProfileSerializer
    
    def perform_create(self, serializer):
        profile = serializer.save()
        detail_text = getattr(profile, DETAIL_COLUMN_NAME, None)
        if not detail_text:
            detail_text = profile.description

        embedding = get_embedding(
            detail_text,
            task_type="RETRIEVAL_DOCUMENT"
        )

        if embedding:
            collection = initialize_vector_db()
            metadata = {
                "Tiêu đề": profile.title,
                "Họ và tên": profile.full_name,
                "Năm sinh": getattr(profile, "born_year", ""),
                "Năm thất lạc": getattr(profile, "losing_year", ""),
                "description": profile.description,
                "profile_id": profile.id,
            }
            try:
                collection.upsert(
                    ids=[str(profile.id)],
                    embeddings=[embedding],
                    metadatas=[metadata]
                )
                print(f"Profile {profile.id} embedded and upserted into ChromaDB.")
            except Exception as e:
                print(f"Error upserting profile {profile.id} into ChromaDB: {e}")
        else:
            print(f"Could not create embedding for profile {profile.id}.")
        return profile
        # Find similar profiles
        similar_profiles = find_similar_profiles(profile)
        return profile

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        profile_id = str(instance.id)
        # Delete from ChromaDB
        try:
            collection = initialize_vector_db()
            collection.delete(ids=[profile_id])
            print(f"Đã xóa profile {profile_id} khỏi ChromaDB.")
        except Exception as e:
            print(f"Lỗi khi xóa profile {profile_id} khỏi ChromaDB: {e}")
        # Delete from database
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['get'])
    def suggested_profiles(self, request, pk=None):
        profile = self.get_object()
        suggestions = ProfileMatchSuggestion.objects.filter(
            Q(profile1=profile) | Q(profile2=profile)
        )
        
        result = []
        for suggestion in suggestions:
            if suggestion.profile1 == profile:
                result.append(suggestion.profile2)
            else:
                result.append(suggestion.profile1)
        
        serializer = ProfileSerializer(result, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_profiles(self, request):
        profiles = Profile.objects.filter(user=request.user)
        serializer = ProfileSerializer(profiles, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def search_by_description(self, request):
        description = request.data.get('description', '')
        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a temporary profile object to generate embedding
        temp_profile = Profile(description=description)
        similar_profiles = find_similar_profiles(temp_profile, top_k=10)
        
        serializer = ProfileSerializer(similar_profiles, many=True, context={'request': request})
        return Response(serializer.data)

class ProfileMatchSuggestionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProfileMatchSuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        user_profiles = Profile.objects.filter(user=user).values_list('id', flat=True)
        return ProfileMatchSuggestion.objects.filter(
            Q(profile1_id__in=user_profiles) | Q(profile2_id__in=user_profiles)
        )
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        suggestion = self.get_object()
        status = request.data.get('status')
        
        if status not in ['accepted', 'rejected']:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        suggestion.match_status = status
        suggestion.save()
        
        serializer = self.get_serializer(suggestion)
        return Response(serializer.data)


# 7. Sử dụng trong ProfileMatchSuggestion

# Trong hàm tạo match suggestion
def create_match_suggestion(profile1, profile2, match_score):
    # Tạo match suggestion
    suggestion = ProfileMatchSuggestion.objects.create(
        profile1=profile1,
        profile2=profile2,
        match_score=match_score
    )
    
    # Gửi thông báo cho chủ sở hữu của profile1
    create_notification(
        user=profile1.user,
        notification_type='match',
        content=f'Tìm thấy hồ sơ phù hợp với "{profile1.title}": "{profile2.title}"',
        related_entity_id=suggestion.id
    )
    
    # Gửi thông báo cho chủ sở hữu của profile2
    create_notification(
        user=profile2.user,
        notification_type='match',
        content=f'Tìm thấy hồ sơ phù hợp với "{profile2.title}": "{profile1.title}"',
        related_entity_id=suggestion.id
    )
    
    return suggestion
