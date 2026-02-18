package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Restaurant;

public interface RestaurantRepository
        extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findByOwnerId(Long ownerId);
}
