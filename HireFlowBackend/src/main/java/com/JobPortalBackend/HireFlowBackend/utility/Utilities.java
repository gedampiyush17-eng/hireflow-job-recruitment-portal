package com.JobPortalBackend.HireFlowBackend.utility;

import com.JobPortalBackend.HireFlowBackend.entity.Sequence;
import com.JobPortalBackend.HireFlowBackend.exception.JobPortalException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;


@Component
@RequiredArgsConstructor
public class Utilities {

    private final MongoOperations mongoOperations;

    public Long getNextSequence(String key) throws JobPortalException {
        Query query=new Query(Criteria.where("_id").is(key));
        Update update=new Update();
        update.inc("seq",1);
        FindAndModifyOptions options=new FindAndModifyOptions();
        options.returnNew(true);
        Sequence seq=mongoOperations.findAndModify(query,update,options,Sequence.class);
        if(seq==null) throw new JobPortalException("Unable to get seq_id for key: "+key);
        return seq.getSeq();
    }

    public String generateOtp(){
        StringBuilder otp=new StringBuilder();
        SecureRandom random=new SecureRandom();
        for(int i=0;i<6;i++){
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}
