package com.codesquad_team01.issue_tracker;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class IssueTrackerApplication {

    public static void main(String[] args){

        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach((entry) ->
            System.setProperty(entry.getKey(), entry.getValue())
        );

        SpringApplication.run(IssueTrackerApplication.class, args);
    }
}
