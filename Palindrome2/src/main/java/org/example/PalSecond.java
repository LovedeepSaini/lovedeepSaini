package org.example;

public class PalSecond implements PalInterface{
    @Override
    public  boolean isPalindrome(String text) {
        int front=0;
        int back=text.length()-1;

        while (back>front){
            char frontChar=text.charAt(front++);
            char backChar=text.charAt(back--);
            if(frontChar != backChar){
                return false;
            }
        }
        return true;
    }
}
