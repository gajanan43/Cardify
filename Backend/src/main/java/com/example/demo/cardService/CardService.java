package com.example.demo.cardService;

import com.example.demo.cardRepo.CardRepo;
import com.example.demo.model.Card;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class CardService {

    @Value("${app.base-url}")
    private String baseUrl;

    @Autowired
    private CardRepo cardRepo;

   public Card createCard(String title, String description, MultipartFile file) throws IOException {
       String uploadDir = System.getProperty("user.dir") + "/uploads/";

       String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

       File uploadPath = new File(uploadDir);
       if (!uploadPath.exists()) {
           uploadPath.mkdirs();
       }

       file.transferTo(new File(uploadDir + fileName));

       Card card = new Card();
       card.setTitle(title);
       card.setDescription(description);
       card.setImageUrl(baseUrl +"/uploads/" + fileName);

       return cardRepo.save(card);
   }


   public Card getCard(Long id){
       Card card = cardRepo.findById(id).orElseThrow(()-> new RuntimeException("Card not found"));

       return card;
   }

    public List<Card> getAllCards() {
        List<Card> cards = cardRepo.findAll();

        return cards;
    }

    public void deleteCard(Long id) {
        Card card = cardRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        // 🔥 extract filename from URL
        String imageUrl = card.getImageUrl();

        if (imageUrl != null) {
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

            String filePath = System.getProperty("user.dir") + "/uploads/" + fileName;

            File file = new File(filePath);

            if (file.exists()) {
                file.delete();   // 🗑️ delete image file
            }
        }

        // 🗑️ delete DB record
        cardRepo.deleteById(id);
    }

    public Card updateCard(Long id, String title, String description, MultipartFile file) throws IOException {

        Card existingCard = cardRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        // 🔹 Update text fields
        existingCard.setTitle(title);
        existingCard.setDescription(description);

        // 🔥 If new image is uploaded
        if (file != null && !file.isEmpty()) {

            // ❌ 1. Delete old image
            String oldImageUrl = existingCard.getImageUrl();

            if (oldImageUrl != null) {
                String oldFileName = oldImageUrl.substring(oldImageUrl.lastIndexOf("/") + 1);

                String oldFilePath = System.getProperty("user.dir") + "/uploads/" + oldFileName;

                File oldFile = new File(oldFilePath);

                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            // ✅ 2. Save new image
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            String newFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            file.transferTo(new File(uploadDir + newFileName));

            // ✅ 3. Update image URL
            existingCard.setImageUrl(baseUrl +"/uploads/" + newFileName);
        }

        return cardRepo.save(existingCard);
    }
}
