package com.codesquad_team01.issue_tracker.auth.repository;

import com.codesquad_team01.issue_tracker.auth.domain.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends CrudRepository<RefreshToken, Long> {

}
