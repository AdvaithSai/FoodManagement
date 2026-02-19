package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.DishRequest;
import com.example.demo.model.Dish;
import com.example.demo.model.Restaurant;
import com.example.demo.repository.RestaurantRepository;
import com.example.demo.service.DishService;

@RestController
@RequestMapping("/api/dishes")
@CrossOrigin(origins="http://localhost:3000")
public class DishController {

    private final DishService service;
    private final RestaurantRepository restaurantRepo;

    public DishController(
            DishService service,
            RestaurantRepository restaurantRepo){
        this.service = service;
        this.restaurantRepo = restaurantRepo;
    }

    @PostMapping("/add/{restaurantId}")
public Dish addDish(
        @RequestBody DishRequest req,
        @PathVariable Long restaurantId){

    Restaurant r = restaurantRepo.findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

    Dish d = new Dish();
    d.setName(req.getName());
    d.setDescription(req.getDescription());
    d.setPrice(req.getPrice());
    d.setRestaurant(r);

    return service.save(d);
}


    @GetMapping("/restaurant/{id}")
    public java.util.List<Dish> getByRestaurant(
            @PathVariable Long id){
        return service.getByRestaurant(id);
    }

    @DeleteMapping("/delete/{dishId}")
public void deleteDish(@PathVariable Long dishId){
    service.delete(dishId);
}

}
