package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RestaurantRequest;
import com.example.demo.model.Restaurant;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.RestaurantService;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins="http://localhost:3000")
public class RestaurantController {

    private final RestaurantService service;
    private final UserRepository userRepo;

    public RestaurantController(
            RestaurantService service,
            UserRepository userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }

    @PostMapping("/add/{ownerId}")
public Restaurant addRestaurant(
        @RequestBody RestaurantRequest req,
        @PathVariable Long ownerId){

    User owner = userRepo.findById(ownerId)
            .orElseThrow(() -> new RuntimeException("Owner not found"));

    Restaurant r = new Restaurant();
    r.setName(req.getName());
    r.setDescription(req.getDescription());
    r.setAddress(req.getAddress());
    r.setCity(req.getCity());
    r.setOwner(owner);

    return service.save(r);
}



    @GetMapping("/owner/{ownerId}")
public List<Restaurant> getOwnerRestaurants(
        @PathVariable Long ownerId){

    return service.getByOwner(ownerId);
}
@GetMapping("/all")
public List<Restaurant> getAllRestaurants(){
    return service.getAll();
}


}
