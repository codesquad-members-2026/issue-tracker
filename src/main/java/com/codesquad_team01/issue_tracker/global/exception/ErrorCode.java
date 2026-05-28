package com.codesquad_team01.issue_tracker.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    INVALID_QUERY_MESSAGE(HttpStatus.BAD_REQUEST, "잘못된 이슈 아이디를 쿼리에 보냈습니다."),
    CAN_NOT_FOUND_THE_PAGE(HttpStatus.NOT_FOUND, "요청하신 이슈 상세 페이지를 찾을 수 없습니다."),
    NOT_FOUND_TOKEN(HttpStatus.UNAUTHORIZED, "토큰이 존재하지 않습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    DUPLICATE_USER_ID(HttpStatus.CONFLICT, "이미 존재하는 아이디입니다."),
    CAN_NOT_LOGIN(HttpStatus.UNAUTHORIZED, "아이디 혹은 비밀번호가 일치하지 않습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다.");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}