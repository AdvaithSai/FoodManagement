package com.example.demo.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Restaurant;
import com.example.demo.repository.RestaurantRepository;

@Service
public class RestaurantService {

    private final RestaurantRepository repo;

    public RestaurantService(RestaurantRepository repo) {
        this.repo = repo;
    }

    public Restaurant save(Restaurant r){
        return repo.save(r);
    }
    public List<Restaurant> getByOwner(Long ownerId){
    return repo.findByOwnerId(ownerId);
}

public List<Restaurant> getAll(){
    return repo.findAll();
}

}
