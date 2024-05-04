package java.com.pwtvapp2;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

public class PackageManagerModule extends ReactContextBaseJavaModule {

    public PackageManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PackageManagerModule";
    }

    @ReactMethod
    public void openApp(String packageName) {
        Intent launchIntent = getReactApplicationContext().getPackageManager().getLaunchIntentForPackage(packageName);
        
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getReactApplicationContext().startActivity(launchIntent);
        } else {
          // logic if not installed
        }
    }

    // @ReactMethod
    // public void installPackage(String filePath) {
    //     File file = new File(filePath);

    //     Uri fileUri;
    //     Intent intent = new Intent(Intent.ACTION_VIEW);
    //     intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

    //     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
    //         // Use FileProvider for Android N (API level 24) and above
    //         fileUri = FileProvider.getUriForFile(getReactApplicationContext(), getReactApplicationContext().getPackageName() + ".fileprovider", file);
    //         intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    //     } else {
    //         fileUri = Uri.fromFile(file);
    //     }

    //     intent.setDataAndType(fileUri, "application/vnd.android.package-archive");

    //     try {
    //         getCurrentActivity().startActivity(intent);
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //     }
    // }

    // @ReactMethod
    // public void uninstallPackage(String packageName) {
    //     Uri packageUri = Uri.parse("package:" + packageName);
    //     Intent uninstallIntent = new Intent(Intent.ACTION_UNINSTALL_PACKAGE, packageUri);
    //     uninstallIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        
    //     try {
    //         getCurrentActivity().startActivity(uninstallIntent);
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //     }
    // }
}