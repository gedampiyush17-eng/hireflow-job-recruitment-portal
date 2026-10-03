package com.JobPortalBackend.HireFlowBackend.dto;

import com.JobPortalBackend.HireFlowBackend.entity.Notification;
import com.JobPortalBackend.HireFlowBackend.dto.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;
    private Long userId;
    private String message;
    private String action;
    private String route;
    private NotificationStatus status;
    private LocalDateTime timeStamp;

    public Notification toEntity(){
        return new Notification(
                this.id,
                this.userId,
                this.message,
                this.action,
                this.route,
                this.status,
                this.timeStamp
        );
    }

}
