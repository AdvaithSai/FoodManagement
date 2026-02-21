package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Order;
import com.example.demo.repository.OrderRepository;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    private final OrderRepository orderRepo;

    public AnalyticsController(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    @GetMapping("/owner/{ownerId}/{period}")
public Map<String, Object> getOwnerAnalytics(
        @PathVariable Long ownerId,
        @PathVariable String period) {

    List<Order> orders = orderRepo.findByOwnerId(ownerId);

    double totalRevenue = 0;
    Map<String, Double> revenueMap = new TreeMap<>();
    Map<String, Integer> dishCount = new HashMap<>();

    for (Order order : orders) {

        if (!order.getStatus().equals("DELIVERED")) continue;

        String key = "";

        if (period.equalsIgnoreCase("daily")) {
            key = order.getCreatedAt().toLocalDate().toString();
        }
        else if (period.equalsIgnoreCase("weekly")) {
            key = "Week " +
                    order.getCreatedAt().getDayOfYear() / 7;
        }
        else if (period.equalsIgnoreCase("monthly")) {
            key = order.getCreatedAt().getYear() + "-" +
                    order.getCreatedAt().getMonthValue();
        }

        for (var item : order.getItems()) {

            double price = item.getDish().getPrice();
            totalRevenue += price;

            revenueMap.put(
                    key,
                    revenueMap.getOrDefault(key, 0.0) + price
            );

            String dishName = item.getDish().getName();
            dishCount.put(
                    dishName,
                    dishCount.getOrDefault(dishName, 0) + 1
            );
        }
    }

    String mostPopular = dishCount.entrySet()
            .stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("None");

    Map<String, Object> response = new HashMap<>();
    response.put("totalRevenue", totalRevenue);
    response.put("totalOrders", orders.size());
    response.put("revenueData", revenueMap);
    response.put("mostPopularItem", mostPopular);

    return response;
}
}