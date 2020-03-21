package com.example.login;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

public class SecondActivity extends AppCompatActivity {

    private Button Logoff;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);


        Logoff = (Button) findViewById(R.id.btnlogoff);
        Logoff.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                homescreen();
            }
        });
    }
    private void homescreen(){
        Intent intent = new Intent(SecondActivity.this, MainActivity.class);
        startActivity(intent);

    }
}
