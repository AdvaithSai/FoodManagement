package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;


@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins="http://localhost:3000")
public class OrderController {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final UserRepository userRepo;

    public OrderController(
            OrderRepository orderRepo,
            OrderItemRepository orderItemRepo,
            CartRepository cartRepo,
            CartItemRepository cartItemRepo,
            UserRepository userRepo){

        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.userRepo = userRepo;
    }

    @PostMapping("/place/{userId}")
    public String placeOrder(@PathVariable Long userId){

        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow();

        List<CartItem> cartItems =
                cartItemRepo.findByCartId(cart.getId());

        if(cartItems.isEmpty()){
            return "Cart is empty";
        }

        Order order = new Order();
        order.setUser(userRepo.findById(userId).orElseThrow());
        orderRepo.save(order);

        for(CartItem item : cartItems){
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setDish(item.getDish());
            orderItem.setQuantity(item.getQuantity());
            orderItemRepo.save(orderItem);
        }

        // Clear cart
        cartItemRepo.deleteAll(cartItems);

        return "Order placed successfully!";
    }

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId){
        return orderRepo.findByUserId(userId);
    }
    @GetMapping("/owner/{ownerId}")
public List<Order> getOrdersForOwner(@PathVariable Long ownerId){
    return orderRepo.findOrdersByOwner(ownerId);
}
@PutMapping("/status/{orderId}/{action}")
@Transactional
public Order updateStatus(
        @PathVariable Long orderId,
        @PathVariable String action){

    Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    if(action.equals("ACCEPT")){
        order.setStatus("PREPARING");
    }
    else if(action.equals("DECLINE")){
        order.setStatus("DECLINED");
    }
    else if(action.equals("SHIP")){
        order.setStatus("SHIPPED");
    }
    else if(action.equals("DELIVER")){
        order.setStatus("DELIVERED");
    }

    return order;
}





}
