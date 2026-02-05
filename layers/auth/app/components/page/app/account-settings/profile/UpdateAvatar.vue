<script lang="ts" setup>
const userStore = useUserStore()
const { errorToast, successToast } = useToastMessage()

const user = computed(() => userStore.user)

async function _handleAvatarUpload(file: File | null | undefined) {
  if (!file)
    return

  const { isValid, error: validationError } = validateFile(file, {
    maxSizeMB: 1,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
  })

  if (!isValid) {
    errorToast({
      title: 'Invalid file',
      description: validationError,
    })
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  return $fetch('/api/me/avatar', {
    method: 'POST',
    body: formData,
  })
    .then(() => userStore.refetchUserSessionData())
    .then(() => {
      successToast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully',
      })
    })
    .catch((error: any) => {
      errorToast({
        title: 'Upload failed',
        description: error?.data?.statusMessage || 'Failed to upload avatar',
      })
    })
}

async function _handleRemoveAvatar() {
  return $fetch('/api/me/avatar', {
    method: 'DELETE',
  })
    .then(() => userStore.refetchUserSessionData())
    .then(() => {
      successToast({
        title: 'Avatar removed',
        description: 'Your profile picture has been removed',
      })
    })
    .catch((error: any) => {
      errorToast({
        title: 'Remove failed',
        description: error?.data?.statusMessage || 'Failed to remove avatar',
      })
    })
}

const { isLoading: isUploading, fnWithLoading: handleAvatarUpload } = useWithLoading(_handleAvatarUpload)
const { isLoading: isRemoving, fnWithLoading: handleRemoveAvatar } = useWithLoading(_handleRemoveAvatar)
</script>

<template>
  <div>
    <div class="flex items-start gap-4">
      <UAvatar
        :src="userStore.avatarUrl"
        :alt="user?.name || 'Profile avatar'"
        :text="getInitials(user?.name)"
        size="3xl"
      />

      <div class="flex-1">
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <UFileUpload
            v-slot="{ open }"
            :model-value="null"
            accept="image/png,image/jpeg,image/gif"
            :multiple="false"
            variant="button"
            :preview="false"
            @update:model-value="(file) => handleAvatarUpload(file as File)"
          >
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-upload"
              :loading="isUploading"
              @click.prevent="open()"
            >
              Change Image
            </UButton>
          </UFileUpload>

          <UButton
            v-if="userStore.avatarUrl"
            color="neutral"
            variant="ghost"
            :loading="isRemoving"
            @click="handleRemoveAvatar"
          >
            Remove Image
          </UButton>
        </div>

        <p class="text-muted text-sm">
          We support PNGs, JPEGs and GIFs under 1MB
        </p>
      </div>
    </div>
  </div>
</template>
