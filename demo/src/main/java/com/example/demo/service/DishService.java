package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Dish;
import com.example.demo.repository.DishRepository;

@Service
public class DishService {

    private final DishRepository repo;

    public DishService(DishRepository repo){
        this.repo = repo;
    }

    public Dish save(Dish d){
        return repo.save(d);
    }

    public List<Dish> getByRestaurant(Long id){
        return repo.findByRestaurantId(id);
    }
}
