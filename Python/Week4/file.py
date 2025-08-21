#opening and reading files 
f = open("name.txt")
print(f.read())
f.close()

#writing(overwriting) into files
f = open("name.txt","w")
f.write("New code")
f.close()

#appending files
f = open("name.txt","a")
f.write("enter into coding\n")
f.close()

#checking files
def access_file():
    filename = input("Enter file name: ")
    try:
        with open(filename,"r") as file:
            content = file.read()
            print(content)
    except FileNotFoundError:
        print("sorry,the file{filename}does not exist.")
access_file()