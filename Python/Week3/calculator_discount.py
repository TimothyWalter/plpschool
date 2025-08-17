price= input("enter price:")
discount=input("enter discount percent:")

if discount>="20":
    print(f"price after discount"+str(int(price) * int(discount)/int(100)))
else:
    print(f"price:{price}")
    