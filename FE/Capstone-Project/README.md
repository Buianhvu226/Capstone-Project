# Capstone-Project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Cấu trúc dự án (đã tái cấu trúc)

```
src/
  assets/
  components/
    common/
      AppHeader.vue
      AppFooter.vue
      AppLoader.vue
      AppPagination.vue
    auth/
      LoginForm.vue
      RegisterForm.vue
    home/
      ProfileList.vue
      SearchFilter.vue
      HeroCarousel.vue
      AdvancedSearchPanel.vue
    profile/
      ProfileForm.vue
      ProfileImageUpload.vue
      SuggestedProfilesSection.vue
      ProfileHeader.vue
      ProfileImagesCard.vue
      ProfileInfoCard.vue
      CommentsSection.vue
    recentlyMissing/
      ContactPersonsForm.vue
      FaceUpload.vue
      RecentlyMissingForm.vue
      RecentlyMissingList.vue
    admin/
      UsersManagement.vue
      AdminAnalytics.vue
    dashboard/
      (tuỳ chọn cho widget/biểu đồ)
  views/
    HomeView.vue
    AuthView.vue
    ...
  router/
    index.js
  store/
    index.js
    modules/
      auth.js, profile.js, recentlyMissing.js, ...
  services/
  utils/
```

### Quy ước
- Dùng PascalCase cho tên component.
- Dùng alias `@` cho import từ `src`.
- Tách view lớn thành các component con để mỗi file < 300 dòng.
