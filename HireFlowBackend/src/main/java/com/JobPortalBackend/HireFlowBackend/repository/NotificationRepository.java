package com.JobPortalBackend.HireFlowBackend.repository;

import com.JobPortalBackend.HireFlowBackend.dto.NotificationStatus;
import com.JobPortalBackend.HireFlowBackend.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification,Long> {

    public List<Notification> findByUserIdAndStatus(Long userId, NotificationStatus status);
}
