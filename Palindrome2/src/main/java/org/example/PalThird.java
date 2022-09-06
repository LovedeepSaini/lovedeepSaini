package org.example;

public class PalThird implements PalInterface{

    @Override
    public boolean isPalindrome(String text) {
        StringBuilder sb=new StringBuilder(text);
        sb.reverse();

        String rev=sb.toString();

        if(text.equals(rev)){

            return true;

        }
        return false;
    }
}
