#operation selection

print("1.add")

print("2.subtract")

print("3.divide")

print("4.multiply")



operation =input("enter your option")



if operation =="1":

     num1 = input("enter the first number:")

     num2 = input("enter the second number:")

     print("the answere is"+str(int(num1) + int(num2)))

elif operation =="2":

     num1 = input("enter the first number:")

     num2 = input("enter the second number:")

     print("the answere is"+str(int(num1) - int(num2)))

elif operation =="3":

     num1 = input("enter the first number:")

     num2 = input("enter the second number")

     print("the answere is"+str(int(num1) / int(num2)))

elif operation =="4":

     num1 = input("enter the first number:")

     num2 = input("enter the second number:")

     print("the answere is"+str(int(num1) * int(num2)))

else:

     print("invalid entry")
