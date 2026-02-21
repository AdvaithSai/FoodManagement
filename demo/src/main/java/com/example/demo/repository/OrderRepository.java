package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Order;

public interface OrderRepository
        extends JpaRepository<Order, Long> {
            @Query("""
   SELECT DISTINCT o FROM Order o
   JOIN o.items oi
   JOIN oi.dish d
   JOIN d.restaurant r
   WHERE r.owner.id = :ownerId
""")
List<Order> findOrdersByOwner(@Param("ownerId") Long ownerId);
    

    List<Order> findByUserId(Long userId);
    @Query("SELECT o FROM Order o JOIN o.items i JOIN i.dish d JOIN d.restaurant r WHERE r.owner.id = :ownerId")
List<Order> findByOwnerId(@Param("ownerId") Long ownerId);
}
