package com.JobPortalBackend.HireFlowBackend.service;

import com.JobPortalBackend.HireFlowBackend.dto.NotificationDTO;
import com.JobPortalBackend.HireFlowBackend.dto.NotificationStatus;
import com.JobPortalBackend.HireFlowBackend.entity.Notification;
import com.JobPortalBackend.HireFlowBackend.exception.JobPortalException;
import com.JobPortalBackend.HireFlowBackend.repository.NotificationRepository;
import com.JobPortalBackend.HireFlowBackend.utility.Utilities;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service("notificattionService")
@RequiredArgsConstructor
public class NotificationServiceImp implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final Utilities utilities;

    @Override
    public void sendNotification(NotificationDTO notificationDTO) throws JobPortalException{
        notificationDTO.setId(utilities.getNextSequence("notification"));
        notificationDTO.setStatus(NotificationStatus.UNREAD);
        notificationDTO.setTimeStamp(LocalDateTime.now());
        notificationRepository.save(notificationDTO.toEntity());
    }

    @Override
    public List<Notification> getUnreadNotifications(Long userId){
        return notificationRepository.findByUserIdAndStatus(userId,NotificationStatus.UNREAD);
    }

    @Override
    public void readNotifications(Long id) throws JobPortalException{
        Notification noti = notificationRepository.findById(id).orElseThrow(()->new JobPortalException("No notification found"));
        noti.setStatus(NotificationStatus.READ);
        notificationRepository.save(noti);
    }
}
