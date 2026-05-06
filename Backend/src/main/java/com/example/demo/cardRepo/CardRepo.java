package com.example.demo.cardRepo;

import com.example.demo.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepo extends JpaRepository<Card,Long> {
}
