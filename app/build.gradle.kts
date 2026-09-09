plugins { id("com.android.application") }

android {
    namespace = "com.otaviobarreto.livingdex"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.otaviobarreto.livingdex"
        minSdk = 26
        targetSdk = 36
        versionCode = 12025
        versionName = "12.25"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
