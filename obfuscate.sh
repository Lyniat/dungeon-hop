cp -avr ./main ./obfuscated/
for file in ./obfuscated/client/*
do
	echo "$file"
	if [[ $file =~ \.js$ ]]
	then
  		jsobfuscate $file >> temp
		rm $file
		mv temp $file
	fi
done
