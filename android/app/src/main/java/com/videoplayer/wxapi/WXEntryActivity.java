package com.videoplayer.wxapi;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.util.Log;

import com.miguvideo.sharesdk.RNShareModule;

/**
 * Created by dongdong on 16/5/28.
 */
public class WXEntryActivity extends Activity {
    private static final String TAG = "RNShareModule";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG, "onCreate intent = " + getIntent());
        RNShareModule.handleIntent(getIntent());
        finish();
    }
    
    /**
     * @see {@link Activity#onNewIntent}
     */	
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        RNShareModule.handleIntent(intent);
    }
}
