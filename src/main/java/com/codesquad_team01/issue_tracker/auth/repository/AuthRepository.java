package com.codesquad_team01.issue_tracker.auth.repository;

import com.codesquad_team01.issue_tracker.auth.domain.RefreshToken;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends CrudRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    @Modifying
    void deleteByMemberId(Long memberId);
}
