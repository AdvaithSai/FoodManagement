package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import com.example.demo.model.Dish;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.DishRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins="http://localhost:3000")
public class CartController {

    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final UserRepository userRepo;
    private final DishRepository dishRepo;

    public CartController(
            CartRepository cartRepo,
            CartItemRepository cartItemRepo,
            UserRepository userRepo,
            DishRepository dishRepo){

        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.userRepo = userRepo;
        this.dishRepo = dishRepo;
    }

    // Add to cart
    @PostMapping("/add/{userId}/{dishId}")
    public CartItem addToCart(
            @PathVariable Long userId,
            @PathVariable Long dishId){

        Cart cart = cartRepo.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(userRepo.findById(userId).orElseThrow());
                    return cartRepo.save(newCart);
                });

        Dish dish = dishRepo.findById(dishId).orElseThrow();

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setDish(dish);
        item.setQuantity(1);

        return cartItemRepo.save(item);
    }

    // View cart
    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId){

        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow();

        return cartItemRepo.findByCartId(cart.getId());
    }

    // Remove item
    @DeleteMapping("/remove/{itemId}")
    public void removeItem(@PathVariable Long itemId){
        cartItemRepo.deleteById(itemId);
    }
}

