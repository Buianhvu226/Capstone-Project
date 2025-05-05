from rest_framework import serializers
from .models import Profile, ProfileImage, ProfileMatchSuggestion

class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = ['id', 'image', 'description']
        read_only_fields = ['id']

class ProfileSerializer(serializers.ModelSerializer):
    images = ProfileImageSerializer(many=True, read_only=True)
    is_owner = serializers.SerializerMethodField()
    siblings = serializers.JSONField(required=False) 

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'title', 'full_name', 'siblings',  # Add 'siblings' here
            'name_of_father', 'name_of_mother', 'born_year', 'losing_year',
            'description', 'status', 'created_at', 'updated_at',
            'images', 'is_owner'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'is_owner']
    
    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.user == request.user
        return False

class ProfileCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        write_only=True
    )
    siblings = serializers.JSONField(required=False) 

    class Meta:
        model = Profile
        fields = [
            'id',
            'title', 'full_name', 'siblings', 
            'name_of_father', 'name_of_mother', 'born_year', 'losing_year',
            'description', 'status', 'images'
        ]
        read_only_fields = ['id']  # <-- Add this line
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        # XÓA siblings_data = validated_data.pop('siblings', [])
        
        validated_data['user'] = self.context['request'].user
        profile = Profile.objects.create(**validated_data)
        
        for image in images_data:
            ProfileImage.objects.create(profile=profile, image=image)
        
        # XÓA for sibling_data in siblings_data: ...
        
        return profile

class ProfileMatchSuggestionSerializer(serializers.ModelSerializer):
    profile1_details = ProfileSerializer(source='profile1', read_only=True)
    profile2_details = ProfileSerializer(source='profile2', read_only=True)
    
    class Meta:
        model = ProfileMatchSuggestion
        fields = [
            'id', 'profile1', 'profile2', 'match_score', 'match_status', 
            'created_at', 'profile1_details', 'profile2_details'
        ]
        read_only_fields = ['id', 'created_at', 'profile1_details', 'profile2_details']