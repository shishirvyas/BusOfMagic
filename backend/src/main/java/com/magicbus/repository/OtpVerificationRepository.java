package com.magicbus.repository;

import com.magicbus.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByContactAndIsVerifiedFalse(String contact);
    Optional<OtpVerification> findByContactAndOtpCode(String contact, String otpCode);
}
