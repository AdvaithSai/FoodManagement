package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestaurantRequest {

    private String name;
    private String description;
    private String address;
    private String city;
}
