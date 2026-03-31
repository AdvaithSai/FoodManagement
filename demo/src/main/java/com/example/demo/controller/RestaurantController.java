package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RestaurantRequest;
import com.example.demo.model.Restaurant;
import com.example.demo.model.User;
import com.example.demo.repository.RestaurantRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.RestaurantService;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins="http://localhost:3000")
public class RestaurantController {

    private final RestaurantService service;
    private final UserRepository userRepo;
    private final RestaurantRepository restaurantRepo;

    public RestaurantController(
            RestaurantService service,
            UserRepository userRepo,
            RestaurantRepository restaurantRepo) {
        this.service = service;
        this.userRepo = userRepo;
        this.restaurantRepo = restaurantRepo;
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

// ── DELETE a restaurant (owner only) ──────────────────────────
@DeleteMapping("/delete/{restaurantId}/{ownerId}")
public ResponseEntity<String> deleteRestaurant(
        @PathVariable Long restaurantId,
        @PathVariable Long ownerId) {

    Restaurant restaurant = restaurantRepo.findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

    if (!restaurant.getOwner().getId().equals(ownerId)) {
        return ResponseEntity.status(403).body("Not authorised to delete this restaurant.");
    }

    service.delete(restaurantId);
    return ResponseEntity.ok("Restaurant deleted successfully.");
}

}
