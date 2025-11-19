namespace Exceptions
{
    internal class ExceptionTester
    {
        static void Main(string[] args)
        {
            /*=======================================================
             * test the first Student (good credits, bad GPA)
             *=======================================================
             */

            Student flo = new Student("Flo");
            flo.Credits = 48;
            flo.Gpa = -7564892.32;

            // print Flo's info
            Console.WriteLine(flo.ToString());


            /*=======================================================
             * test the second Student (bad credits, good GPA)
             *=======================================================
             */

            Student mo = new Student("Mo");
            mo.Credits = 1024;
            mo.Gpa = 3.64;

            // print Mo's info
            Console.WriteLine(mo.ToString());

        }
    }
}