package com.magicbus.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Database Configuration Properties
 * 
 * Reads database configuration from environment variables or application.properties
 * Environment variables take precedence over application.properties
 * 
 * Example usage:
 * export DB_HOST=recursive-kind-db.postgres.database.azure.com
 * export DB_USER=recursivekindadmin
 * export DB_PASSWORD=Shishir#901
 * export DB_NAME=postgres
 * export DB_PORT=5432
 * 
 * Then run: ./gradlew bootRun
 */
@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix = "spring.datasource")
public class DatabaseConfig {

    private String url;
    private String username;
    private String password;
    private String driverClassName;

    // Getters and Setters
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDriverClassName() {
        return driverClassName;
    }

    public void setDriverClassName(String driverClassName) {
        this.driverClassName = driverClassName;
    }
}
