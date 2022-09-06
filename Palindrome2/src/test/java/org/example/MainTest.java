package org.example;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MainTest {
    @Test
    @DisplayName("Check isPalindrome")
    void checkString() {
        PalFirst pal1 = new PalFirst();

        Assertions.assertEquals(true, pal1.isPalindrome("anna"));
        Assertions.assertEquals(false, pal1.isPalindrome("yduolc"));
        Assertions.assertTrue(pal1.isPalindrome("racecar"));
        Assertions.assertTrue(pal1.isPalindrome("RADAR"));
    }
    @Test
    @DisplayName("Check Palindrome in String")
    void testSentence() {
        PalFirst pal1 = new PalFirst();
        Assertions.assertFalse(pal1.isPalindrome("murder for a jar of red rum"));
        Assertions.assertTrue(pal1.isPalindrome("rats live on no evil star"));
        Assertions.assertTrue(pal1.isPalindrome("step on no pets"));
        Assertions.assertFalse(pal1.isPalindrome("this should fail"));
    }
    @Test
    @DisplayName("Valid Palindrome")
    public void validPalindromeTest()  {
        PalThird pal3 = new PalThird();
        Assertions.assertTrue(pal3.isPalindrome("rats live on no evil star"));
    }

    @Test
    @DisplayName("Invalid Palindrome")
    public void invalidPalindromeTest()  {
        PalThird pal3 = new PalThird();
        Assertions.assertFalse(pal3.isPalindrome("I am a tester"));
    }
}



