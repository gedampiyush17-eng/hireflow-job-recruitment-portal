package com.JobPortalBackend.HireFlowBackend.entity;

import com.JobPortalBackend.HireFlowBackend.dto.NotificationDTO;
import com.JobPortalBackend.HireFlowBackend.dto.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection="notification")
public class Notification {

    @Id
    private Long id;

    private Long userId;
    private String message;
    private String action;
    private String route;
    private NotificationStatus status;
    private LocalDateTime timeStamp;

    public NotificationDTO toDTO(){
        return new NotificationDTO(
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
