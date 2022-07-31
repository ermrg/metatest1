from rest_framework import serializers
from user_management.models import Web3User


class Web3UserSerializer(serializers.ModelSerializer):

    def get_employees(self):
        qs = Web3User.objects.filter(role='employee')
        serializer = Web3UserSerializer(instance=qs, many=True)
        return serializer.data
    class Meta:
        model = Web3User
        fields = '__all__'