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
