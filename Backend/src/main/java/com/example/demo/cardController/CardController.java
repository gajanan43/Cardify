package com.example.demo.cardController;

import com.example.demo.cardService.CardService;
import com.example.demo.model.Card;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/card")
@CrossOrigin(origins = "http://localhost:3000")
public class CardController {

    @Autowired
    private CardService cardService;

    @PostMapping()
    public Card createCard(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile file
    ) throws IOException {

        return cardService.createCard(title, description, file);
    }

    @GetMapping("/{id}")
    public Card getCard(@PathVariable Long id){
        return cardService.getCard(id);
    }

    @GetMapping()
    public List<Card> getAllCards(){
        return cardService.getAllCards();
    }

    @DeleteMapping("/{id}")
    public String deleteCard(@PathVariable Long id){
        cardService.deleteCard(id);
        return "Card Successfully";
    }

    @PutMapping("/{id}")
    public Card updateCard(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile file
    ) throws IOException {

        return cardService.updateCard(id, title, description, file);
    }
}
