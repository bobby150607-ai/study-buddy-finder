package com.studybuddy.repository;

import com.studybuddy.entity.Connection;
import com.studybuddy.entity.ConnectionStatus;
import com.studybuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    @Query("SELECT c FROM Connection c WHERE (c.requester = :u1 AND c.receiver = :u2) OR (c.requester = :u2 AND c.receiver = :u1) ORDER BY c.updatedAt DESC")
    List<Connection> findConnectionsBetweenUsers(@Param("u1") User u1, @Param("u2") User u2);

    default Optional<Connection> findConnectionBetweenUsers(User u1, User u2) {
        return findConnectionsBetweenUsers(u1, u2).stream().findFirst();
    }

    @Query("SELECT c FROM Connection c WHERE (c.requester.id = :u1Id AND c.receiver.id = :u2Id) OR (c.requester.id = :u2Id AND c.receiver.id = :u1Id) ORDER BY c.updatedAt DESC")
    List<Connection> findConnectionsBetweenUserIds(@Param("u1Id") Long u1Id, @Param("u2Id") Long u2Id);

    default Optional<Connection> findConnectionBetweenUserIds(Long u1Id, Long u2Id) {
        return findConnectionsBetweenUserIds(u1Id, u2Id).stream().findFirst();
    }

    @Query("SELECT c FROM Connection c WHERE (c.requester.id = :userId OR c.receiver.id = :userId) AND c.status = com.studybuddy.entity.ConnectionStatus.ACCEPTED")
    List<Connection> findAcceptedConnectionsByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Connection c WHERE c.receiver.id = :userId AND c.status = com.studybuddy.entity.ConnectionStatus.PENDING ORDER BY c.createdAt DESC")
    List<Connection> findIncomingPendingRequests(@Param("userId") Long userId);

    @Query("SELECT c FROM Connection c WHERE c.requester.id = :userId AND c.status = com.studybuddy.entity.ConnectionStatus.PENDING ORDER BY c.createdAt DESC")
    List<Connection> findOutgoingPendingRequests(@Param("userId") Long userId);

    @Query("SELECT c FROM Connection c WHERE (c.requester.id = :userId OR c.receiver.id = :userId)")
    List<Connection> findAllConnectionsByUserId(@Param("userId") Long userId);
}
