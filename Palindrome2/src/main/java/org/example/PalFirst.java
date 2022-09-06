package org.example;

public class PalFirst implements PalInterface {
    @Override
    public boolean isPalindrome(String text) {
        String reversed = "";
        // String noSpace = text.replaceAll("\\s+", "").toLowerCase();

        for (int i = 0; i < text.length(); i++) {
            reversed = text.charAt(i) + reversed;
            if (reversed.equals(text)) {
                return true;
            }
        }
        return false;
    }
}
