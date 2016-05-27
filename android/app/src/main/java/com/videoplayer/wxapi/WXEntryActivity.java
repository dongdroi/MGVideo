package com.videoplayer.wxapi;

import android.app.Activity;
import android.os.Bundle;

import com.miguvideo.sharesdk.RNShareModule;

/**
 * Created by richardcao on 16/1/28.
 */
public class WXEntryActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        RNShareModule.handleIntent(getIntent());
        finish();
    }
}
