package com.rootscare;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.ReactActivity;

import org.json.JSONObject;

import io.branch.indexing.BranchUniversalObject;
import io.branch.referral.Branch;
import io.branch.referral.BranchError;
import io.branch.referral.util.LinkProperties;

public class MainActivity extends ReactActivity {


  @Override
  protected void onStart() {
    super.onStart();
    Branch.sessionBuilder(this).withCallback(new Branch.BranchUniversalReferralInitListener() {
      @Override
      public void onInitFinished(BranchUniversalObject branchUniversalObject, LinkProperties linkProperties, BranchError error) {
        if (error != null) {
          Log.e("BranchSDK_Tester", "branch init failed. Caused by -" + error.getMessage());
        } else {
          Log.e("BranchSDK_Tester", "branch init complete!");
          if (branchUniversalObject != null) {
            Log.e("BranchSDK_Tester", "title " + branchUniversalObject.getTitle());
            Log.e("BranchSDK_Tester", "CanonicalIdentifier " + branchUniversalObject.getCanonicalIdentifier());
            Log.e("BranchSDK_Tester", "metadata " + branchUniversalObject.getContentMetadata().convertToJson());
          }

          if (linkProperties != null) {
            Log.e("BranchSDK_Tester", "Channel " + linkProperties.getChannel());
            Log.e("BranchSDK_Tester", "control params " + linkProperties.getControlParams());
          }
        }
      }
    }).withData(this.getIntent().getData()).init();
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    this.setIntent(intent);
    Branch.sessionBuilder(this).withCallback(new Branch.BranchReferralInitListener() {
      @Override
      public void onInitFinished(JSONObject referringParams, BranchError error) {
        if (error != null) {
          Log.e("BranchSDK_Tester", error.getMessage());
        } else if (referringParams != null) {
          Log.e("BranchSDK_Tester", referringParams.toString());
        }
      }
    }).reInit();
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "rootscare";
    
  }
}


