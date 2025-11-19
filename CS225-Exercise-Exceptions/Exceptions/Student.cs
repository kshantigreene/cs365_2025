using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Exceptions
{
    public class Student
    {
        // instance variables
        private int credits;
        private double gpa;



        // Constructs a student with the given @name
        public Student(string name)
        {
            Name = name;
        }



        // Gets and sets the student's name
        public string Name { get; set; }



        // Gets and sets the student's number of credits
        public int Credits
        {
            get { return credits; }
            set
            {
                if (value < 0 || value > 180)
                {
                    Console.WriteLine($"Bad number of credits for {Name}.");
                }
                else
                {
                    this.credits = value;
                }
            }
        }


        // Gets and sets the student's GPA.
        public double Gpa
        {
            get { return gpa; }
            set
            {
                if (value < 0.0 || value > 4.0)
                {
                    Console.WriteLine($"Bad GPA for {Name}");
                }
                else
                {
                    this.gpa = value;
                }
            }
        }



        // Returns a string representation of the student (name, credits, and GPA)
        public override string ToString()
        {
            return $"{Name} has {Credits} credits with a GPA of {Gpa:f2}";
        }
    }

}
