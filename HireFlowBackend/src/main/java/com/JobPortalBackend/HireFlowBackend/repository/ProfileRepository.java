package com.JobPortalBackend.HireFlowBackend.repository;

import com.JobPortalBackend.HireFlowBackend.entity.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends MongoRepository<Profile,Long> {
}
