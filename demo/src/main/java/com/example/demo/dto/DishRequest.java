package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DishRequest {

    private String name;
    private String description;
    private double price;
}
