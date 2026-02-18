package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Dish;

public interface DishRepository
        extends JpaRepository<Dish, Long> {

    List<Dish> findByRestaurantId(Long restaurantId);
}
