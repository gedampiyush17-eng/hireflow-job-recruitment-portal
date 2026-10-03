package com.JobPortalBackend.HireFlowBackend.service;

import com.JobPortalBackend.HireFlowBackend.dto.NotificationDTO;
import com.JobPortalBackend.HireFlowBackend.entity.Notification;
import com.JobPortalBackend.HireFlowBackend.exception.JobPortalException;

import java.util.List;

public interface NotificationService {

    public void sendNotification(NotificationDTO notificationDTO) throws JobPortalException;
    public List<Notification> getUnreadNotifications(Long userId);
    public void readNotifications(Long id) throws JobPortalException;
}
