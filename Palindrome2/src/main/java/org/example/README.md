# Palindrome Checker App
#### General
###### A palindrome is a series of letters whose order remains the same if it is read from left to right (usual direction) or from right to left (backwards).

#### App Overview

###### Application allows a user to use any of three different classes for checking palindrome.

### Program Flow

1. Application starts with a paragraph containing a full sentence
  * A method splits the sentence into individual sentence.
   * In Another method user is given a choice regarding the Palindrome checker class required.
2. The individual words are tested to check whether they are Palindrome
  * if they are palindrome then they are added to a list of Palindrome found.
* otherwise they are discarded.
3. The list of Palindromes is returned to main program  and then displayed.
````
package org.example;

import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void  main(String[] args) {


        System.out.println(chooseMethod("kayak my wow rat naan race grace rotator"));

    }
        
        static ArrayList chooseMethod(String text) {

            PalFirst pal1 = new PalFirst();
            //  System.out.println(PalFirst.isPalindrome("naan"));
            PalSecond pal2 = new PalSecond();
            //   System.out.println(PalFirst.isPalindrome("aabbaa cc"));
            PalThird pal3 = new PalThird();
            //System.out.println(PalFirst.isPalindrome("this rotator"));
            String PayFirst = "First";
            String PaySecond = "Second";
            String PayThird = "Third";
            System.out.println("Enter your choice(First/Second/Third):");
            Scanner input = new Scanner(System.in);
            String choose = input.next();
            ArrayList wordList = new ArrayList();
            String[] strArray = text.split(" ");
            if (choose.equals(PayFirst)) {
            for (int i = 0; i < strArray.length; i++) {
                    //System.out.println(strArray[i]);
                    if (pal1.isPalindrome(strArray[i])) {
                        wordList.add(strArray[i]);
                        }
                        }
            } else if (choose.equals(PaySecond)) {
            for (int i = 0; i < strArray.length; i++) {
                    //System.out.println(strArray[i]);
                    if (pal2.isPalindrome(strArray[i])) {
                        wordList.add(strArray[i]);
                        }
                }

            } else if (choose.equals(PayThird)){
                for (int i = 0; i < strArray.length; i++) {
                    //System.out.println(strArray[i]);
                    if (pal3.isPalindrome(strArray[i])) {
                        wordList.add(strArray[i]);
                    }
                }
            }
            return wordList;
            }
    }

````



4. Define Interface with a single method that takes one string parameter and returns true if parameter is palindrome.
````
package org.example;

public interface PalInterface {
 boolean isPalindrome(String text);
}

````
5.  Create the three classes that each implements this interface and that each use different strategy to complete the task.

````
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
````
````
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
````

````
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

````
### Tests 

````
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


````
