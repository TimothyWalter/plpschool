#1.assignment
class smartphone:
    def __init__(self,version,brand):
        self.version = version
        self.brand = brand
    def display(self):
        print(f"{self.version} {self.brand}is available." )

the_phone = smartphone("9.5 Experience","Galaxy s25")
the_phone.display()

#2.polymorphism using python (Activity)
class plane:
    def __init__(self,brand,model):
        self.brand = brand
        self.model = model

    def move(self):
        print(f"{self.brand} {self.model}is flying.")

the_plane = plane("boeng","742")
the_plane.move()