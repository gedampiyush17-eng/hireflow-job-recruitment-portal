package com.JobPortalBackend.HireFlowBackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(JobPortalException.class)
    public ResponseEntity<Map<String,String>> handleJobPortalException(JobPortalException exception){

        Map<String,String> response=new HashMap<>();
        response.put("error", exception.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,String>> handleGeneralException(Exception exception){

        Map<String,String> response=new HashMap<>();
        response.put("error","Something went wrong");

        return new ResponseEntity<>(response,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
